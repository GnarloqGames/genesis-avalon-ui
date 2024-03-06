import { useEffect, useState } from "react";
import { AuthContextProps, useAuth } from "react-oidc-context";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from "react";

import axios, { AxiosResponse } from "axios";
import { Blueprint, BuildingInventory, BuildingRegistry, IBuildingProps, IBuildings } from "../Types/Buildings";

const registry: BuildingRegistry = {
    blueprints: {
        "house": new Blueprint("house"),
        "warehouse": new Blueprint("warehouse"),
    }
}

const postBuild = async (auth: AuthContextProps, kind: string) => {
    if (!auth.isAuthenticated || auth.user === undefined || auth.user === null) {
        return
    }

    const accessToken = auth.user.access_token;

    const response = await axios
        .post(`${window.config.apiBaseUrl}/build`,
            {
                kind: kind
            },
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )

    console.log(response)
}

const useFetch = (url: string, auth: AuthContextProps) => {
    const [buildings, setBuildings] = useState({} as IBuildings);

    useEffect(() => {
        if (!auth.isAuthenticated || auth.user === undefined || auth.user === null) {
            return
        }

        const accessToken = auth.user.access_token;

        const getBuildings = async () => {
            await axios.get(url, {
                headers: {
                    "Authorization": accessToken,
                }
            }).then((res: AxiosResponse) => {
                setBuildings(res.data as IBuildings)
            }).catch((error) => {
                console.log(error)
            })
        }

        const id = setInterval(getBuildings, 30000);
        getBuildings();

        return () => clearInterval(id);
    }, [url, auth])

    return buildings
};


const Buildings = () => {
    const auth = useAuth();

    const buildings = useFetch(`${window.config.apiBaseUrl}/buildings`, auth)

    const inventory: BuildingInventory = {}

    for (const prop in registry.blueprints) {
        const name = registry.blueprints[prop].name
        inventory[name] = []
    }

    if (buildings.count > 0) {
        buildings.buildings.forEach((item) => {
            inventory[item.name].push(item)
        });
    }

    return (
        <div className="buildingList">
            {Object.keys(inventory).map((el) => {
                return <Building key={el} name={el} buildings={inventory[el]} />
            })}            
        </div>
    )
}

const Building = (props: IBuildingProps) => {
    const auth = useAuth();
    const handleClick = () => {
        postBuild(auth, props.name)
    }

    let unfinished: number = 0;
    let failed: number = 0;
    let done: number = 0;

    props.buildings.forEach((item) => {
        switch (item.status) {
            case "done":
                done += 1;
                break;
            case "failed":
                failed += 1;
                break;
            default:
                unfinished += 1;
        }
    });

    const card = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h4">{props.name}</Typography>
                <Typography variant="body1" component="div">
                    <ul>
                        <li><label>Unfinished: {unfinished + failed}</label></li>
                        <li><label>Finished: {done}</label></li>
                    </ul>
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleClick}>Build new</Button>
            </CardActions>
        </React.Fragment>
    )

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
}

export default Buildings;