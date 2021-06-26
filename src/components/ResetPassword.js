import React, { useState } from "react";
import { Button, Stack, Input } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
const ResetPassword = () => {
  const [email, setEmail] = useState();
  const { Moralis } = useMoralis();

  return (
    <Stack spacing={3}>
      <Input
        isRequired
        placeholder="E-Mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button
        onClick={() => {
          Moralis.User.requestPasswordReset(email)
            .then(() => {
              alert("Password request successfull, please check your Email!");
            })
            .catch((error) => {
              alert("Error:" + error.code + " " + error.message);
            });
        }}
      >
        Request Password Reset
      </Button>
    </Stack>
  );
};

export default ResetPassword;
