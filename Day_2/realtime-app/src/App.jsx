import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Container, Typography, Button, Card, CardContent } from "@mui/material";

const socket = io("http://localhost:5000"); // Connect to the backend

export default function App() {
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (streaming) {
      socket.on('connection',()=>{
        console.log("connected");
      })
      socket.on("cricketData", (data) => {
        setScore(data.score);
        setWickets(data.wickets);
      });
    } else {
      socket.off("cricketData");
    }

    return () => socket.off("cricketData");
  }, [streaming]);

  const handleStreaming = () => {
    setStreaming((prev) => !prev);
    socket.emit(streaming ? "stopStreaming" : "startStreaming");
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Card variant="outlined" sx={{ padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Live Cricket Dashboard</Typography>
          <Typography variant="h5">Score: <strong>{score} runs</strong></Typography>
          <Typography variant="h5" >Wickets: <strong>{wickets}</strong></Typography>
          <Button
            variant="contained"
            color={streaming ? "secondary" : "primary"}
            onClick={handleStreaming}
            sx={{ marginTop: 2 }}
          >
            {streaming ? "Stop Streaming" : "Start Streaming"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}