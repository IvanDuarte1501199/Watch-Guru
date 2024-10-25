import { PersonProps } from "@appTypes/person/personProps";

interface PersonSectionProps {
  person: PersonProps;
}

const PersonSection = ({ person }: PersonSectionProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative bg-gray-900 text-white pt-4 md:pt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-8">
        {/* Poster Image */}
        <div className="w-full md:w-1/3">
          {person?.profile_path ? (
            <img
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              className="rounded-lg shadow-lg w-full object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-800 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Person Details */}
        <div className="w-full md:w-2/3 pb-8 md:pb--">
          <h1 className="text-4xl font-bold mb-4">{person?.name}</h1>

          {person?.biography && <p className="p-guru mb-6">{person?.biography}</p>}

          {/* Birthdate and Place of Birth */}
          {person.birthday && person.place_of_birth && <div className="mb-4">
            <p>
              <strong>Born: </strong>
              {formatDate(person.birthday)} {person.place_of_birth && `in ${person.place_of_birth}`}
            </p>
          </div>
          }
          {/* Department and Popularity */}
          {person.known_for_department && <div className="mb-4">
            <p>
              <strong>Known for: </strong>
              {person.known_for_department}
            </p>
          </div>}

          {/* Homepage */}
          {person.homepage && (
            <div>
              <a
                href={person.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Visit Official Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonSection;
