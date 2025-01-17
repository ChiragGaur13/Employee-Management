'use client';

import { useState } from 'react';
import { teamMembers, TeamMember } from '@/api/team';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [search, setSearch] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    bio: '',
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const router = useRouter();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.bio) {
      const newMemberWithId = { id: Date.now(), ...newMember };
      const updatedMembers = [...members, newMemberWithId];
      setMembers(updatedMembers);

      // Save to localStorage
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));

      setNewMember({ name: '', role: '', bio: '' });
    } else {
      alert('Please fill out all fields before adding a member.');
    }
  };

  const handleDeleteMember = (id: number) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
  };

  const handleEditMember = (id: number) => {
    const memberToEdit = members.find((m) => m.id === id);
    if (memberToEdit) {
      setEditingMember(memberToEdit);
    }
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.id === editingMember.id ? editingMember : m
        )
      );
      setEditingMember(null); // Close the modal
    }
  };

  const handleSelectMember = (id: number) => {
    router.push(`/task/${id}`);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Keen&Able</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="search" className="text-lg font-medium">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or role"
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            />
            <input
              type="text"
              placeholder="Bio"
              className="border rounded-lg px-4 py-2 flex-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={newMember.bio}
              onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <li
                key={member.id}
                className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectMember(member.id)}
              >
                <h3 className="text-lg font-bold text-blue-600">{member.name}</h3>
                <p className="text-gray-700">{member.role}</p>
                <p className="text-gray-500 mt-2">{member.bio}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMember(member.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMember(member.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {editingMember && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Member</h2>
              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={editingMember.role}
                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                placeholder="Role"
              />
              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={editingMember.bio}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                placeholder="Bio"
              />
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setEditingMember(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
