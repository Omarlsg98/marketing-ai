"use client";

import CustomerPersonaCard from "@/components/general/CustomerPersonaCard";
import { PersonaListOut } from "@/types/api/persona";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Component() {
  const [personas, setPersonas] = useState<PersonaListOut>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/persona/list");
      const data = await response.json();
      setPersonas(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const PersonaOverview = () => (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <CustomerPersonaCard
            key = {index}
            persona={persona}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg">
      <div className="p-4">
        <section className="bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                All Personas
              </h3>
            </div>
          </div>
          {/* Tabs */}
          <div className="mb-8">
            <div className="mt-4 p-4 bg-white rounded-lg">
              {loading && <p>Loading...</p>}
              {!loading &&  personas.length > 0 &&<PersonaOverview />}
              {!loading && personas.length === 0 && (
                <div className="items-center">
                <h4  className="text-l text-gray-800">No personas found. Create a new persona to get started.</h4>
                <br />
                <Link href="/my/personas/create" className="bg-[#75C5D5] text-white px-4 py-2 rounded-md w-full sm:w-auto">
                  Create Persona 
                </Link>
               </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
