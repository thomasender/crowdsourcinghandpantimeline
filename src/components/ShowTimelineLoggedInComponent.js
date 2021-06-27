import React, { useEffect, useState } from "react";
import { Box, Image, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Moralis } from "moralis";

function ShowTimelineLoggedInComponent({ allMemes, fetchAllMemes }) {
  let currentUser = Moralis.User.current();

  useEffect(async () => {
    fetchAllMemes();
    let query = new Moralis.Query("Memes");
    let subscription = await query.subscribe();
    subscription.on("create", fetchAllMemes);
  }, []);

  const memes = allMemes.map((meme, i) => (
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
      <Text key={`Description` + meme.id}>
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
        {meme.attributes.votes !== undefined ? meme.attributes.votes : ""}
      </Text>
      {currentUser.attributes.username !==
        meme.attributes.owner.attributes.username &&
      !meme.attributes.voters.includes(currentUser.id) ? (
        <Button
          onClick={async (event) => {
            const Memes = Moralis.Object.extend("Memes");
            const query = new Moralis.Query(Memes);
            const toUpdate = await query.get(meme.id);
            console.log(toUpdate);
            await toUpdate.increment("votes");
            await toUpdate.save();
            await toUpdate.addUnique("voters", currentUser.id);
            await toUpdate.save();
            console.log(toUpdate);
            window.location.reload();
          }}
        >
          Vote
        </Button>
      ) : (
        ""
      )}
      {currentUser.attributes.username !==
        meme.attributes.owner.attributes.username &&
      meme.attributes.voters.includes(currentUser.id) ? (
        <Button
          onClick={async (event) => {
            const Memes = Moralis.Object.extend("Memes");
            const query = new Moralis.Query(Memes);
            const toUpdate = await query.get(meme.id);
            await toUpdate.decrement("votes");
            await toUpdate.save();
            const voters = toUpdate.attributes.voters;
            const voterIndex = voters.indexOf(currentUser.id);
            if (voterIndex > -1) {
              voters.splice(voterIndex, 1);
            }
            await toUpdate.set("voters", voters);
            await toUpdate.save();
            window.location.reload();
          }}
        >
          Unvote
        </Button>
      ) : (
        ""
      )}
    </Box>
  ));

  return (
    <>
      <Heading textAlign="center">The Timeline</Heading>
      <Stack spacing={7}>{memes}</Stack>
    </>
  );
}

export default ShowTimelineLoggedInComponent;
