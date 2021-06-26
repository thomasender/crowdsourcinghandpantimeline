import React, { useState } from "react";
import { Button, Stack, Input } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
const SignUp = () => {
  const { signup } = useMoralis();
  const [userName, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  return (
    <Stack spacing={3}>
      <Input
        isRequired
        placeholder="Username"
        value={userName}
        onChange={(event) => setUsername(event.target.value)}
      />
      <Input
        isRequired
        placeholder="E-Mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        isRequired
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button onClick={() => signup(userName, password, email)}>Sign Up</Button>
    </Stack>
  );
};

export default SignUp;
