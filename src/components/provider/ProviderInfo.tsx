import { ProviderProps } from "@appTypes/provider/provider";

const ProviderInfo = ({ label, providers }: { label: string; providers: ProviderProps[] }) => {
  return (
    <>
      {providers && providers.length > 0 && (
        <div className="mb-4">
          <h4 className="p-guru mb-2 font-semibold">{label}:</h4>
          <ul className="flex gap-2">
            {providers.map(provider => (
              <li key={provider.provider_id}>
                <img
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-12 h-12 rounded-md"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ProviderInfo;
