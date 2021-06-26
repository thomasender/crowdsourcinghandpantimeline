import React from "react";
import { Moralis } from "moralis";
import { Heading, Text } from "@chakra-ui/react";

function GreetUser() {
  const currentUser = Moralis.User.current();
  const currentUsername = currentUser.get("username");
  return (
    <Heading>
      Welcome to Meme of the Handpan Timeline{" "}
      <Text> {currentUser ? currentUsername : ""}</Text>
    </Heading>
  );
}

export default GreetUser;
