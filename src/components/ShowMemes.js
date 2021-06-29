import React, { useEffect, updateState } from "react";
import { Box, Image, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Moralis } from "moralis";

function ShowMemes({ results, fetchUsersMemes }) {
  const memes = results.map((meme, i) => (
    <Box align="center">
      <Text m="2" key={`Title` + meme.id}>
        <strong>Title: </strong>
        {meme.attributes.name && meme.attributes.name}
      </Text>
      <Text m="2" key={`dateOfConcern` + meme.id}>
        <strong>Date of Concern: </strong>
        {meme.attributes.dateOfConcern &&
          meme.attributes.dateOfConcern.toLocaleDateString()}
      </Text>
      <Text m="2" key={`Description` + meme.id}>
        <strong>Description: </strong>
        {meme.attributes.description && meme.attributes.description}
      </Text>
      {meme.attributes.ipfs !== undefined ? (
        <Text m="2">
          Link:{" "}
          <a href={meme.attributes.ipfs} target="_blank">
            {meme.attributes.ipfs}
          </a>
        </Text>
      ) : (
        ""
      )}
      {meme.attributes.ipfs !== undefined ? (
        <Image m="2" src={meme.attributes.ipfs} alt={meme.attributes.name} />
      ) : (
        ""
      )}

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
        }}
      >
        Delete Contribution
      </Button>
    </Box>
  ));

  useEffect(async () => {
    fetchUsersMemes();
    let query = new Moralis.Query("Memes");
    let subscription = await query.subscribe();
    subscription.on("create", fetchUsersMemes);
    subscription.on("update", fetchUsersMemes);
    subscription.on("delete", fetchUsersMemes);
  }, []);

  return (
    <>
      {results.length > 0 ? (
        <Box align="center">
          <Heading textAlign="center">Your Contributions</Heading>
          <Stack spacing={7}>{memes}</Stack>
        </Box>
      ) : (
        <Heading textAlign="center">You have no contributions</Heading>
      )}
    </>
  );
}

export default ShowMemes;
