import React, { useState } from "react";
import { Moralis } from "moralis";
import { Box, Button, Input, Textarea, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function UploadComponent({ fetchUsersMemes }) {
  const currentUser = Moralis.User.current();

  const [name, setName] = useState();
  const titleInputRef = React.useRef();
  const [file, setFile] = useState();
  const fileInputRef = React.useRef();
  const [description, setDescription] = useState();
  const descriptionInputRef = React.useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [value, updateValue] = useState(new Date());
  const [date, setDate] = useState(new Date());

  function onChange(date) {
    setDate(date);
    console.log(date);
  }

  const handleUploadNoFile = async () => {
    if (name === "" || name === undefined) {
      alert("Please enter a title!");
      return;
    }
    if (description === "" || description === undefined) {
      alert("Please enter a description!");
      return;
    }
    setIsUploading(true);
    console.log("Saving...");
    const NewMeme = new Moralis.Object.extend("Memes");
    const newMeme = new NewMeme();
    newMeme.set("dateOfConcern", date);
    newMeme.set("owner", currentUser);
    newMeme.set("name", name);
    newMeme.set("description", description);
    newMeme.set("votes", 0);
    newMeme.set("voters", []);

    await newMeme.save();
    console.log("Contribution saved to database");

    //Clean up
    titleInputRef.current.value = "";
    setName("");
    descriptionInputRef.current.value = "";
    setDescription("");

    await fetchUsersMemes();
    console.log("Fetching user contributions");
    setIsUploading(false);
    alert(
      "Your contribution was saved! You can see it in Your Contributions - Section"
    );

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

    setIsUploading(false);
    setName("");
    setDescription("");
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const MoralisFile = new Moralis.File(file.name, file);
    await MoralisFile.saveIPFS();
    const ipfs = await MoralisFile.ipfs();
    const hash = await MoralisFile.hash();

    console.log("File created. Uploading to database");

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
    console.log("Contribution saved to database");
    //Clean up
    titleInputRef.current.value = "";
    setName("");
    descriptionInputRef.current.value = "";
    setDescription("");
    fileInputRef.current.value = "";
    setFile(null);

    await fetchUsersMemes();
    console.log("Fetching user contributions");
    setIsUploading(false);
    alert(
      "Your meme got created! You can see it in Your Contributions - Section"
    );
  };

  return (
    <Box>
      <FormControl id="title" isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          m="2"
          placeholder="Choose a descriptive title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          textAlign="center"
          ref={titleInputRef}
        />
      </FormControl>

      <Box align="center">
        <FormControl id="timestamp" isRequired>
          <FormLabel>Timestamp</FormLabel>
          <Text>Please provide the relevant timestamp</Text>
          <Calendar date={date} onChange={onChange} />
        </FormControl>
      </Box>
      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          m="2"
          placeholder="Describe your contribution! Also, do provide sources in form of links or add a file below!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          textAlign="center"
          isRequired
          ref={descriptionInputRef}
        />
      </FormControl>
      <Text textAlign="center">
        Upload up to 1 file per contribution (not mandatory)
      </Text>
      <Input
        m="2"
        type={"file"}
        placeholder="Name"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        ref={fileInputRef}
      />
      {isUploading === false ? (
        <Box align="center">
          <Button
            m="2"
            onClick={() => {
              if (file !== undefined) {
                handleUpload();
              } else {
                handleUploadNoFile();
              }
            }}
          >
            Submit Contribution
          </Button>
        </Box>
      ) : (
        <Box align="center">
          <Button
            m="2"
            isLoading
            loadingText="Uploading..."
            colorScheme="teal"
            variant="outline"
          >
            Uploading...
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default UploadComponent;
