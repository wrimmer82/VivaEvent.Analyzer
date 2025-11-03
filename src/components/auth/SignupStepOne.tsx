import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Music, Building2, Briefcase } from "lucide-react";

interface SignupStepOneProps {
  onUserTypeSelect: (userType: "artista" | "venue" | "professionista") => void;
  onSwitchToLogin: () => void;
}

const SignupStepOne = ({ onUserTypeSelect, onSwitchToLogin }: SignupStepOneProps) => {
  const [selectedType, setSelectedType] = useState<string>("");

  const userTypes = [
    {
      value: "artista",
      icon: Music,
      title: "Artista",
      description: "Registrati come artista per trovare venue dove suonare",
    },
    {
      value: "venue",
      icon: Building2,
      title: "Venue/Locale",
      description: "Registrati come venue per trovare artisti",
    },
    {
      value: "professionista",
      icon: Briefcase,
      title: "Professionista",
      description: "Booking agent, manager, organizzatore evento",
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelect(selectedType as "artista" | "venue" | "professionista");
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Inizia ora
        </h1>
        <p className="text-muted-foreground">
          Scegli il tipo di account che vuoi creare
        </p>
      </div>

      <RadioGroup value={selectedType} onValueChange={setSelectedType}>
        <div className="space-y-4">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.value}
                className={`relative flex items-start space-x-4 rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  selectedType === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor={type.value}
                      className="text-lg font-semibold cursor-pointer"
                    >
                      {type.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <Button
        onClick={handleContinue}
        disabled={!selectedType}
        className="w-full mt-8 bg-primary hover:bg-primary/90"
      >
        Continua
      </Button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Hai già un account?{" "}
        <button
          type="button"
          className="text-primary hover:underline font-medium"
          onClick={onSwitchToLogin}
        >
          Accedi
        </button>
      </div>
    </>
  );
};

export default SignupStepOne;
