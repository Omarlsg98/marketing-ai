import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatEditColumnComponent,
  ChatEditColumnPersona,
} from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { CheckCircle, Plus, X } from "lucide-react";
import { FC, useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: (value: string) => void;
}

function EditableField({ label, value, onEdit }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{label}</h4>
      {isEditing ? (
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onEdit(currentValue);
          }}
          autoFocus
        />
      ) : (
        <div
          className="p-2 border rounded cursor-text"
          onClick={() => setIsEditing(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
}

interface EditableArrayFieldProps {
  label: string;
  values: string[];
  onEdit: (values: string[]) => void;
}

function EditableArrayField({
  label,
  values,
  onEdit,
}: EditableArrayFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValues, setCurrentValues] = useState(values);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAdd = () => {
    setCurrentValues([...currentValues, ""]);
    setHasChanges(true);
  };

  const handleRemove = (index: number) => {
    setCurrentValues(currentValues.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleChange = (index: number, value: string) => {
    setCurrentValues(currentValues.map((v, i) => (i === index ? value : v)));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (!hasChanges) return;
    onEdit(currentValues.filter((v) => v.trim() !== ""));
  };

  return (
    <Card className="space-y-2">
      <CardContent>
        <h4 className="font-semibold py-4">{label}</h4>
        {isEditing ? (
          <>
            {currentValues.map((value, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button onClick={handleSave}>{
                hasChanges ? "Save" : "Cancel"
                }</Button>
            </div>
          </>
        ) : (
          <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
            <ul className="list-disc list-inside">
              {values.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PersonaTabProps {
  displayInfo: ChatEditColumnComponent;
  handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  submitting: boolean;
}

const PersonaTab: FC<PersonaTabProps> = ({
  displayInfo,
  handleDone,
  submitting,
}) => {
  const currentInfoPersona = displayInfo.current as ChatEditColumnPersona;
  if (!currentInfoPersona) return null;

  const [persona, setPersona] = useState(currentInfoPersona);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEdit = (field: string, value: string | string[]) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const submitInfo = async () => {
    if (!hasChanges) {
      await handleDone(
        "I like the Persona, it is good enough, let's continue",
        {
          saved: true,
        }
      );
    } else {
      await handleDone("What do you think about these changes?", {
        edited: true,
        modifications: persona,
      });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Persona Details</CardTitle>
          <p className="mb-1 text-sm text-muted-foreground">
            Edit the details for this persona. Click done when you're finished.
          </p>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <EditableField
              label="Name"
              value={persona.name}
              onEdit={(value) => handleEdit("name", value)}
            />
            <EditableField
              label="Title"
              value={persona.title}
              onEdit={(value) => handleEdit("title", value)}
            />
            <div className="space-y-2">
              <h4 className="font-semibold">Short Description</h4>
              <Textarea
                value={persona.shortDescription}
                onChange={(e) => handleEdit("shortDescription", e.target.value)}
                className="w-full"
              />
            </div>
            <EditableArrayField
              label="Demographics"
              values={persona.demographics}
              onEdit={(values) => handleEdit("demographics", values)}
            />
            <EditableArrayField
              label="Psychographics"
              values={persona.psychographics}
              onEdit={(values) => handleEdit("psychographics", values)}
            />
            <EditableArrayField
              label="Behavior"
              values={persona.behavior}
              onEdit={(values) => handleEdit("behavior", values)}
            />
            <EditableArrayField
              label="Needs"
              values={persona.needs}
              onEdit={(values) => handleEdit("needs", values)}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-6">
        <Button
          onClick={submitInfo}
          disabled={submitting}
          className="px-6 py-2 text-lg"
        >
          {submitting
            ? "Submitting..."
            : hasChanges
              ? "Submit Changes"
              : "Done"}
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PersonaTab;
