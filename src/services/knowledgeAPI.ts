import axios from "axios";
import { Document } from "../models/api/Document";

require('dotenv').config();

const endpoint = "https://api.genesysappliedresearch.com/v2/knowledge";
const languageCode = "en-US";

async function generateToken(): Promise<void> {
  const headers = {
    organizationid: process.env.GENESYS_AI_ORG_ID,
    secretkey: process.env.GENESYS_AI_SECRET_KEY
  };
  return axios.post(
    "https://api.genesysappliedresearch.com/v2/knowledge/generatetoken",
    {},
    { headers }
  );
}

async function createDocument(
  token: string,
  question: string,
  answer: string,
  externalUrl?: string
): Promise<void> {
  // Create request body:
  let body: Document = {
    type: "faq",
    faq: {
      question: question,
      answer: answer
    },
    externalUrl: externalUrl
  };
  // Send request:
  let headers = {
    "Content-Type": "application/json",
    organizationid: process.env.GENESYS_AI_ORG_ID,
    token: token
  };
  return axios.post(
    `${endpoint}/knowledgebases/${process.env.GENESYS_AI_ORG_ID}/languages/${languageCode}/documents/`,
    body,
    { headers }
  );
}

async function createBulkTwitterDocument(tweets: any, token: string) {
  let bulkBody: Document[] = [];
  tweets.forEach((tweet: any, index: number): void => {
    // Remove special characters and newlines
    tweet.full_text = tweet.full_text.replace('"', "");
    tweet.full_text = tweet.full_text.replace("'", "");
    tweet.full_text = tweet.full_text.replace(/\r?\n|\r/g, "");

    // Remove urls but save them for externalUrl
    let matches = tweet.full_text.match(/https?:\/\/\S+/gi);
    if (!matches || !matches.length) {
      matches = [""];
    }
    tweet.full_text = tweet.full_text.replace(/https?:\/\/\S+/gi, "");

    let body: Document = {
      type: "faq",
      faq: {
        question: tweet.full_text,
        answer: tweet.full_text
      },
      externalUrl: matches[0]
    };
    bulkBody.push(body);
  });

  let headers = {
    "Content-Type": "application/json",
    organizationid: process.env.GENESYS_AI_ORG_ID,
    token: token
  };
  return axios.patch(
    `${endpoint}/knowledgebases/${process.env.GENESYS_AI_ORG_ID}/languages/${languageCode}/documents/`,
    bulkBody,
    { headers }
  );
}
export { generateToken, createDocument, createBulkTwitterDocument };
