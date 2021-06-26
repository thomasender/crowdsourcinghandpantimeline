import React from "react";
import { useMoralis } from "react-moralis";
import {
  AlertIcon,
  Alert,
  Box,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

function AuthError() {
  const { authError } = useMoralis();
  return (
    <div>
      <Alert status="error">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Authentication has failed!</AlertTitle>
          <AlertDescription display="block">
            {authError.message}
          </AlertDescription>
        </Box>
      </Alert>
    </div>
  );
}

export default AuthError;
