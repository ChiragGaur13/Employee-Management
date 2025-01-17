export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
}


export function teamMembers(): TeamMember[] {
  return JSON.parse(localStorage.getItem('teamMembers') || '[]');
}

export function addMember(member: TeamMember) {
  const members = teamMembers(); // Get the current team members
  members.push(member); // Add the new member to the array
  saveMembers(members); // Save the updated list back to localStorage
}


export function deleteMember(id: number) {
  const members = teamMembers(); // Get the current team members
  const updatedMembers = members.filter((member) => member.id !== id); // Remove the member with the matching ID
  saveMembers(updatedMembers); // Save the updated list back to localStorage
}

// Utility function to save members back to localStorage
function saveMembers(members: TeamMember[]) {
  localStorage.setItem('teamMembers', JSON.stringify(members));
  
}
