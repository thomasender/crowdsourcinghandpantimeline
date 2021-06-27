import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Stack,
  Text,
  Image,
  Button,
  Box,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import LogOut from "./components/LogOut";
import AuthError from "./components/AuthError";
import ResetPassword from "./components/ResetPassword";
import UploadComponent from "./components/UploadComponent";
import GreetUser from "./components/GreetUser";
import ShowMemes from "./components/ShowMemes";
import ShowTimelineComponent from "./components/ShowTimelineComponent";
import ShowTimelineLoggedInComponent from "./components/ShowTimelineLoggedInComponent";
import Moralis from "moralis/lib/browser/Parse";

function App() {
  const { isAuthenticated, authError, isInitialized } = useMoralis();
  const [user, setUser] = useState();
  const [results, setResults] = useState([]);
  const [allMemes, setAllMemes] = useState([]);

  //Fetches and sets current User from Moralis session
  const setCurrentUser = async () => {
    const currentUser = Moralis.User.current();
    if (currentUser) {
      setUser(currentUser);
      console.log("CU", currentUser);
    }
    return currentUser;
  };

  //fetches Memes of Current User
  const fetchUsersMemes = async () => {
    const query = new Moralis.Query("Memes");
    query.equalTo("owner", Moralis.User.current());
    const results = await query.find();
    console.log(results);
    results.sort(function (a, b) {
      var c = new Date(a.attributes.dateOfConcern);
      var d = new Date(b.attributes.dateOfConcern);
      return c - d;
    });
    console.log("sorted", results);
    // alert("Retrieved " + results.length + " memes.");

    if (results !== undefined && results.length > 0) {
      setResults(results);
      //console.log(results);
    }
  };

  const fetchAllMemes = async () => {
    const query = new Moralis.Query("Memes");
    const allMemes = await query.find();
    allMemes.sort(function (a, b) {
      var c = new Date(a.attributes.dateOfConcern);
      var d = new Date(b.attributes.dateOfConcern);
      return c - d;
    });
    setAllMemes(allMemes);
  };

  if (isAuthenticated) {
    return (
      <Container maxW="container.lg">
        <Stack spacing={6}>
          <GreetUser />
          <LogOut />
          <Tabs isLazy defaultIndex={1} isFitted variant="enclosed">
            <TabList>
              <Tab>The Timeline</Tab>
              <Tab>Your contributions</Tab>
              <Tab>Upload new contribution</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {" "}
                {allMemes !== undefined ? (
                  <ShowTimelineLoggedInComponent
                    fetchAllMemes={fetchAllMemes}
                    allMemes={allMemes}
                  />
                ) : (
                  "Loading Memes..."
                )}
              </TabPanel>
              <TabPanel>
                {" "}
                {results !== undefined ? (
                  <ShowMemes
                    fetchUsersMemes={fetchUsersMemes}
                    results={results}
                  />
                ) : (
                  "Looks like you don't have any Memes yet!"
                )}
              </TabPanel>
              <TabPanel>
                <UploadComponent
                  user={user}
                  fetchUsersMemes={fetchUsersMemes}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    );
  }

  return (
    <div className="App">
      <Container maxW="container.md">
        <Box>
          <Heading mb={6} textAlign="center">
            Crowdsourcing Handpan Timeline
          </Heading>
        </Box>

        {authError && <AuthError />}
        <Tabs isFitted variant="enclosed">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
            <Tab>Show Timeline</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={8}>
                <LogIn setCurrentUser={setCurrentUser} />
                <ResetPassword />
              </Stack>
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
            <TabPanel>
              <Text color="red" align="center">
                Login or SignUp to use all features
              </Text>
              {isInitialized === true ? (
                <ShowTimelineComponent
                  fetchAllMemes={fetchAllMemes}
                  allMemes={allMemes}
                />
              ) : (
                "Loading..."
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
