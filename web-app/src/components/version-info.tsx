import { useState, useEffect } from "react";
import { getVersionInfo } from "../lib/app/actions";

interface Version {
  version: string;
  environment: string;
}

const DEFAULT_VERSION = { version: "1.0.0", environment: "local" };

const VersionInfo = () => {
  const [versionInfo, setVersionInfo] = useState<Version>(DEFAULT_VERSION);

  useEffect(() => {
    getVersionInfo().then((data) => setVersionInfo(data));
  }, []);

  if (!versionInfo) return null;

  return (
    <div className="">
      <p>Version: {versionInfo.version}</p>
      <p>Environment: {versionInfo.environment}</p>
    </div>
  );
};

export default VersionInfo;
