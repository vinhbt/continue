import ContinueLogo from "../../ContinueLogo";
import QuickStartSubmitButton from "../components/QuickStartSubmitButton";

function OnboardingQuickstartTab() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-3/4 text-center">
        <div className="mr-5">
          {/*<ContinueLogo height={75} />*/}
          <p className={"text-2xl font-bold"}>Welcome to VCopilot!</p>
        </div>

        <p className="text-sm">
          VCopilot is beta stage so please contacts to SE Operation to supports.
        </p>


        {/*<p className="text-sm">*/}
        {/*  Quickly get up and running using our API keys. After this trial, we'll*/}
        {/*  help you set up your own models.*/}
        {/*</p>*/}

        {/*<p className="text-sm">*/}
        {/*  To prevent abuse, we'll ask you to sign in to GitHub.*/}
        {/*</p>*/}

        {/*<QuickStartSubmitButton />*/}
      </div>
    </div>
  );
}

export default OnboardingQuickstartTab;
