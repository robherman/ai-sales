"use client";

import { useState } from "react";
import TitleCard from "../ui/card/title-card";
import Image from "next/image";
import Link from "next/link";

const INITIAL_INTEGRATION_LIST = [
  {
    id: "1",
    name: "Salesforce",
    icon: "",
    isActive: false,
    description:
      "It provides customer relationship management software and applications focused on sales, customer service, marketing automation.",
    type: "salesforce",
  },
  {
    id: "2",
    name: "SAP",
    icon: "",
    isActive: false,
    description:
      "American developer and marketer of software products for inbound marketing, sales, and customer service.",
    type: "sap",
  },
];

function Integrations() {
  const [integrationList, setIntegrationList] = useState(
    INITIAL_INTEGRATION_LIST,
  );

  const toogleIntegration = (type: string) => {
    let integration = integrationList.find((i) => i.type === type);
    setIntegrationList(
      integrationList.map((i, k) => {
        if (i.type === integration?.type)
          return { ...i, isActive: !i.isActive };
        return i;
      }),
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {integrationList.map((i, k) => {
          return (
            <TitleCard key={k} title={i.name} topMargin={"mt-2"}>
              <Link href={`/integrations/${i.type}`} className="flex">
                {/* <Image
                  alt="icon"
                  src={i.icon}
                  className="mr-4 inline-block h-12 w-12"
                  width={80}
                  height={80}
                /> */}
                {i.description}
              </Link>

              <div className="mt-6 text-right">
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-lg"
                  checked={i.isActive}
                  onChange={() => toogleIntegration(i.type)}
                />
              </div>
            </TitleCard>
          );
        })}
      </div>
    </>
  );
}

export default Integrations;
