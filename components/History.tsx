import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

const previousWork = [
  {
    position: "Head of Product",
    company: "Lamini",
    link: "https://lamini.ai",
  },
  {
    position: "Co-founder and CEO",
    company: "Nemo",
    link: "https://www.youtube.com/watch?v=IEvZmzYIZQY",
  },
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
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-around gap-4 mb-8">
        <Link to="/about/how-i-got-into-pm" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            How I got into PM
          </Button>
        </Link>
        <Link to="/about/user-manual" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            User manual for working with me
          </Button>
        </Link>
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-6">Current</h2>

      <ResumeEntry
        position="Director of Product, Temporal Cloud"
        company="Temporal"
        link="https://temporal.io"
      />

      <h2 className="text-xl md:text-2xl font-bold mb-6">Previous</h2>
      {previousWork.map((work) => (
        <ResumeEntry key={work.position} {...work} />
      ))}
    </div>
  );
}
