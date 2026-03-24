import PersonForm from "@/components/admin/PersonForm";

export const metadata = {
  title: "Add Person | VanshVriksha Admin",
};

export default function AddPersonPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-forest">
        Add New Person
      </h1>
      <PersonForm mode="add" />
    </div>
  );
}
