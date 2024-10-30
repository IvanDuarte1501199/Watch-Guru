import { CountryProviders } from "@appTypes/provider/provider";
import ProviderInfo from "./ProviderInfo";

const ProvidersInfo = ({ providers }: { providers: CountryProviders }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-16">
      <ProviderInfo label='stream' providers={providers?.flatrate || []} />
      <ProviderInfo label='rent' providers={providers?.rent || []} />
      <ProviderInfo label='buy' providers={providers?.buy || []} />
    </div>
  );
};
export default ProvidersInfo;
