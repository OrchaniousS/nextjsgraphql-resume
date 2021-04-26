import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";
import path from "path";
import { print } from "graphql/language/printer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import prismStyle from "react-syntax-highlighter/dist/esm/styles/prism/xonokai";
// import { style } from "react-syntax-highlighter/src/styles/prism/xonokai";

import {
  Container,
  Header,
  Grid,
  Dimmer,
  Loader,
  Image,
  Segment,
} from "semantic-ui-react";

import styles from "styles/Home.module.css";

const ResumeQuery = gql`
  query ResumeQuery {
    bio {
      name
      email
      tagline
      website
      github
      linkedin
      objective
    }
    positions {
      id
      title
      company
      location
      years
      months
      startDate
      endDate
      achievements
    }
  }
`;

export default function Home() {
  const { data, error, loading } = useQuery(ResumeQuery);

  if (error) {
    return <span>Error....</span>;
  }

  if (loading) {
    return (
      <header className={styles.header}>
        Orchan Magramov
        <Segment>
          <Dimmer active inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        </Segment>
      </header>
    );
  }

  const { bio, positions } = data;

  const header = (
    <div className={styles.header}>
      <Head>
        <title>Resume | Next.js | GrahpQL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header as="h2">
        <div>
          <Image
            // size="tiny"
            style={{
              display: "inline-block",
              marginTop: "0.14285714em",
              width: "2.5em",
              height: "auto",
              verticalAlign: "middle",
              borderRadius: "500rem",
            }}
            src={`${path.join(process.cwd(), "images", "orchan.jpg")}`}
          />{" "}
          Orchan Magramov
        </div>
        <code className={styles.code}>Full-Stack Developer</code>
      </Header>
    </div>
  );

  return (
    <Container>
      {header}
      <Grid className={styles.split} divided="vertically" centered>
        <Grid.Column>
          <Grid.Row className={styles.left}>
            <h2>Contact</h2>
            <p>
              <strong>Email</strong>{" "}
              <a href={`mailto:${bio.email}`}>{bio.email}</a>
            </p>
            <p>
              <strong>Website</strong>{" "}
              <a href={bio.website}>{new URL(bio.website).host}</a>
            </p>
            <p>
              <strong>GitHub</strong>{" "}
              <a href={bio.github}>{bio.github.replace("https://", "")}</a>
            </p>
            <p>
              <strong>LinkedIn</strong>{" "}
              <a href={bio.linkedin}>
                {bio.linkedin.replace("https://www.", "")}
              </a>
            </p>
          </Grid.Row>
          <Grid.Row>
            <SyntaxHighlighter
              language="graphql"
              highlighter={"prism" || "hljs"}
              // style={style.xonokai}
            >
              {print(ResumeQuery)}
            </SyntaxHighlighter>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row className={styles.right}>
            <h2>Objective</h2>
            <p>{bio.objective}</p>
            <h2>Experience</h2>
            {positions.map((position) => {
              const length = [
                position.years > 0 ? `${position.years} yrs` : null,
                position.months > 0 ? `${position.months} mths` : null,
              ]
                .filter((str) => str)
                .join(" ");
              return (
                <div key={position.id}>
                  <h3>{position.title}</h3>
                  <p className={styles.light}>
                    {position.company} | {position.location}
                  </p>
                  <p className={styles.light}>
                    {format(new Date(position.startDate), "MMM yyyy")} -{" "}
                    {position.endDate
                      ? format(new Date(position.endDate), "MMM yyyy")
                      : "Current"}{" "}
                    ({length})
                  </p>
                  <ul>
                    {position.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
