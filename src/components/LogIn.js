import React, { useState } from "react";
import { Button, Stack, Input } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";

const LogIn = ({ setCurrentUser }) => {
  const { login } = useMoralis();
  const [userName, setUsername] = useState();
  const [password, setPassword] = useState();

  return (
    <Stack spacing={3}>
      <Input
        placeholder="Username"
        value={userName}
        onChange={(event) => setUsername(event.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        onClick={() => {
          login(userName, password);
          setCurrentUser();
        }}
      >
        Log In
      </Button>
    </Stack>
  );
};

export default LogIn;
