import React, { useEffect } from "react";
import { Box, Image, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Moralis } from "moralis";

function ShowTimelineComponent({ allMemes, fetchAllMemes }) {
  //"pdf"
  // const currentUser = Moralis.User.current();
  const memes = allMemes.map((meme, i) => (
    <Box align="center">
      <Text m="2" key={`Title` + meme.id}>
        <strong>Title: </strong>
        {meme.attributes.name}
      </Text>
      <Text key={`Description` + meme.id}>
        <strong>Description: </strong>
        {meme.attributes.description}
      </Text>
      <Text m="2" key={`Owner` + meme.id}>
        <strong>Meme Owner: </strong>{" "}
        {meme.attributes.owner.attributes.username !== undefined
          ? `${meme.attributes.owner.attributes.username}`
          : " Not available"}
      </Text>
      {/* <Text>
        <strong>Hash: </strong> {meme.attributes.hash}
      </Text> */}
      <Text m="2">
        Link:{" "}
        <a href={meme.attributes.ipfs} target="_blank">
          {meme.attributes.ipfs}
        </a>
      </Text>
      <Image m="2" src={meme.attributes.ipfs} alt={meme.attributes.name} />
      <Text m="2">
        <strong>Votes: </strong>
        {meme.attributes.votes}
      </Text>
    </Box>
  ));

  useEffect(() => {
    fetchAllMemes();
  }, []);

  return (
    <>
      <Heading textAlign="center">The Timeline</Heading>
      <Stack spacing={7}>{memes}</Stack>
    </>
  );
}

export default ShowTimelineComponent;
