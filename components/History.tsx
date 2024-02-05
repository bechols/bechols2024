import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const previousWork = [
  {
    position: "Director of Product Management, Confluent Cloud",
    company: "Confluent",
    link: "https://www.confluent.io",
  },
  {
    position: "Director of Product Management, Data and Analytics",
    company: "HouseCanary",
    link: "https://www.housecanary.com",
  },
  {
    position: "Senior Product Manager, Bitbucket Cloud",
    company: "Atlassian",
    link: "https://www.atlassian.com",
  },
  {
    position: "Director of Product Management",
    company: "Originate",
    link: "https://www.originate.com",
  },
  {
    position: "Product Manager",
    company: "Location Labs",
    link: "https://www.locationlabs.com",
  },
  {
    position: "Research Training Consultant + Research Associate",
    company: "Forrester Research",
    link: "https://www.forrester.com",
  },
  {
    position: "BA in Philosophy + Cognitive Science concentration",
    company: "Williams College",
    link: "https://www.williams.edu",
  },
];

function ResumeEntry({
  position,
  company,
  link,
}: {
  position: string;
  company: string;
  link: string;
}) {
  return (
    <a href={link} target="_blank" rel="noreferrer noopener">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{position}</CardTitle>
        </CardHeader>
        <CardContent>{company}</CardContent>
      </Card>
    </a>
  );
}

export default function History() {
  return (
    <div>
      <h2>Current</h2>

      <ResumeEntry
        position="Co-founder and CEO"
        company="Something new"
        link="/"
      />
      <h2>Previous</h2>
      {previousWork.map((work) => (
        <ResumeEntry key={work.position} {...work} />
      ))}
    </div>
  );
}
