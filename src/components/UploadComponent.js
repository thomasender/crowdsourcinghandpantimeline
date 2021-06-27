import React, { useState } from "react";
import { Moralis } from "moralis";
import { Box, Button, Input, Textarea, Text } from "@chakra-ui/react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function UploadComponent({ user, fetchUsersMemes }) {
  const currentUser = Moralis.User.current();

  const [name, setName] = useState();
  const [file, setFile] = useState();
  const [description, setDescription] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [value, updateValue] = useState(new Date());
  const [date, setDate] = useState(new Date());

  function onChange(date) {
    setDate(date);
    console.log(date);
  }

  const handleUpload = async () => {
    setIsUploading(true);
    const MoralisFile = new Moralis.File(file.name, file);
    await MoralisFile.saveIPFS();
    const ipfs = await MoralisFile.ipfs();
    const hash = await MoralisFile.hash();

    console.log("Meme created. Fetching data...");

    if (ipfs && hash) {
      const NewMeme = new Moralis.Object.extend("Memes");
      const newMeme = new NewMeme();
      newMeme.set("ipfs", ipfs);
      newMeme.set("hash", hash);
      newMeme.set("file", MoralisFile);
      newMeme.set("dateOfConcern", date);
      newMeme.set("owner", currentUser);
      newMeme.set("name", name);
      newMeme.set("description", description);
      newMeme.set("votes", 0);
      newMeme.set("voters", []);

      await newMeme.save();
      await fetchUsersMemes();
      setIsUploading(false);
      alert("Your meme got created! You can see it in Your Memes - Section");
      const query = new Moralis.Query("Memes");
      query.equalTo("owner", currentUser);
      await query.find().then(([meme]) => {
        console.log("Meme Item from Moralis", meme);
        // console.log("Meme Name", meme.attributes.name);
        // console.log("userName of MemeOwner", meme.attributes.owner);
        // console.log("IPFS of Meme", meme.attributes.ipfs);
        // console.log("IPFSHash of Meme", meme.attributes.hash);
        // console.log("Description of Meme", meme.attributes.description);
        // console.log("Votecount of Meme", meme.attributes.votes);
        // console.log("Voters:", meme.attributes.voters);
      });
    }
    setIsUploading(false);
    setName("");
    setDescription("");
  };

  return (
    <Box>
      <Input
        m="2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        textAlign="center"
      />
      <Box align="center">
        <Text>Pick the timestamp of concern</Text>
        <Calendar date={date} onChange={onChange} />
      </Box>

      <Textarea
        m="2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        textAlign="center"
      />
      <Text textAlign="center">Upload up to 1 file per contribution</Text>
      <Input
        m="2"
        type={"file"}
        placeholder="Name"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <Box align="center">
        <Button m="2" onClick={handleUpload}>
          Submit Contribution
        </Button>
      </Box>
    </Box>
  );
}

export default UploadComponent;
