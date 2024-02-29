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

interface IBuilding {
    id: string,
    name: string,
    status: string,
    owner: string,
}

interface IBuildings {
    count: number,
    buildings: IBuilding[]
}

interface IBuildingProps {
    building: GroupedBuilding
}

class GroupedBuilding {
    id = ""
    name = ""
    unfinished = 0
    failed = 0
    done = 0

    constructor(id: string, name: string) {
        this.id = id
        this.name = name;
    }

    increase(status: string, amount: number) {
        if (["pending","inprogress","failed","done","interrupted"].indexOf(status) == -1) {
            return
        }

        switch (status) {
            case "interrupted":
            case "pending":
            case "inprogress":
                this.unfinished += amount
                break
            case "failed":
                this.failed += amount
                break;
            case "done":
                this.done += amount
                break;
        }
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

        const id = setInterval(getBuildings, 5000);
        getBuildings();

        return () => clearInterval(id);
    }, [url, auth])

    return buildings
};


const Buildings = () => {
    const auth = useAuth();

    const buildings = useFetch("http://localhost:8080/buildings", auth)

    if (buildings.buildings === null || buildings.buildings === undefined || buildings.count == 0) {
        return (
            <div>No buildings</div>
        )
    }

    const groupedBuildings: GroupedBuilding[] = [];
    buildings.buildings.map((item: IBuilding) => {
        let found = false;
        groupedBuildings.forEach((groupedItem: GroupedBuilding) => {
            if (item.name == groupedItem.name) {
                found = true
                groupedItem.increase(item.status, 1)
            }
        })
        if (!found) {
            const b = new GroupedBuilding(item.id, item.name)
            b.increase(item.status, 1)
            groupedBuildings.push(b);
        }
    })

    return (
        <div className="buildingList">
            {groupedBuildings.map((item) => {
                return <Building key={item.id} building={item} />
            })}
        </div>
    )
}

const Building = (props: IBuildingProps) => {
    const auth = useAuth();
    const handleClick = () => {
        postBuild(auth, props.building.name)
    }

    const card = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h4">{props.building.name}</Typography>
                <Typography variant="body1" component="div">
                    <ul>
                        <li><label>Unfinished: {props.building.unfinished + props.building.failed}</label></li>
                        <li><label>Finished: {props.building.done}</label></li>
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