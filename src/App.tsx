import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Nav from "./Component/Nav";
import Profile from "./Pages/Profile";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Box from '@mui/material/Box';
import Index from "./Pages/Index";
import Buildings from "./Pages/Buildings";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/test',
    element: <div>test</div>
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/buildings',
    element: <Buildings />
  }
]);

function App() {
  return (
    <>
    <Nav />
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid2 container spacing={2}>
        <Grid2
          sm={10}
          smOffset={1}
          mdOffset={2}
          md={8}
        >
          <RouterProvider router={router} />
        </Grid2>
      </Grid2>
    </Box>
    </>
  )
}

export default App;