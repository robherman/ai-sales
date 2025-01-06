import Image from "next/image";

function LandingIntro() {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="text-center text-3xl font-bold">
            <Image
              src="/logo.png"
              className="mask mask-circle mr-2 inline-block w-12"
              alt="dashwind-logo"
              width={240}
              height={240}
            />
            {`AI SalesBoost`}
          </h1>

          <div className="mt-12 text-center">
            {/* <img
              src="./intro.png"
              alt="Dashwind Admin Template"
              className="inline-block w-48"
            ></img> */}
          </div>

          {/* Importing pointers component */}
          {/* <TemplatePointers /> */}
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
