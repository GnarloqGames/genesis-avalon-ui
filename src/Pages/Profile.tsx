import { Typography } from "@mui/material";
import { useAuth } from "react-oidc-context";

const Profile = () => {
  const auth = useAuth();

  let content: JSX.Element
  let accessToken = <div></div>
  if (!auth.isAuthenticated) {
    content = <div>Not authenticated</div>
  } else {
    const profile = JSON.stringify(auth.user?.profile, null, 2);
    content = <div><pre>{profile}</pre></div>

    const storage: string | null = sessionStorage.getItem("oidc.user:https://idman.0x42.in/realms/dev.avalon.cool:dev.avalon.cool")
    if ( storage !== null ) {
      const tok = JSON.parse(storage).access_token
      accessToken = <textarea rows={10} cols={60}>{tok}</textarea>
    }
  }

  return (
    <>
      <Typography variant="h2" gutterBottom>Profile</Typography>
      <Typography variant="body1">{content}</Typography>
      <Typography variant="h4">Access token</Typography>
      <Typography variant="body2">{accessToken}</Typography>
    </>
  )
}

export default Profile;