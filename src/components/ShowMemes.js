import React, { useEffect, updateState } from "react";
import { Box, Image, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Moralis } from "moralis";

function ShowMemes({ results, fetchUsersMemes }) {
  const memes = results.map((meme, i) => (
    <Box align="center">
      <Text m="2" key={`Title` + meme.id}>
        <strong>Title: </strong>
        {meme.attributes.name}
      </Text>
      {/* <Text key={`Owner` + meme.id}>
        <strong>Contributor: </strong>{" "}
        {meme.attributes.owner.attributes.username}
      </Text> */}
      <Text m="2" key={`Description` + meme.id}>
        <strong>Description: </strong>
        {meme.attributes.description}
      </Text>
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
      <Button
        onClick={async () => {
          const Memes = Moralis.Object.extend("Memes");
          const query = new Moralis.Query(Memes);
          const toDelete = await query.get(meme.id);
          await toDelete.destroy();
          window.location.reload();
        }}
      >
        Delete Meme
      </Button>
    </Box>
  ));

  useEffect(() => {
    fetchUsersMemes();
  }, []);

  return (
    <>
      <Heading textAlign="center">Your Contributions</Heading>
      <Stack spacing={7}>{memes}</Stack>
    </>
  );
}

export default ShowMemes;
