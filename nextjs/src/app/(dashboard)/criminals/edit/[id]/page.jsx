import CriminalForm from "@/components/criminals/CriminalForm"


async function getCriminal(id) {
  const res = await fetch(`http://localhost:4000/api/criminals/${id}`);
  if (!res.ok) throw new Error('Failed to fetch criminal');
  return res.json();
}

export default async function EditCriminal({ params }) {
  const { id } = await params;
  const criminal = await getCriminal(id);
  // Transform crimes array if needed
  const initialData = {
    ...criminal,
    crimes: criminal.crimes || []
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Criminal</h1>
      <CriminalForm 
        isEditing={true}
        initialData={initialData}
      />
    </div>
  );
}