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
    const members = teamMembers(); 
    members.push(member); 
    saveMembers(members); 
  }


  export function deleteMember(id: number) {
    const members = teamMembers(); 
    const updatedMembers = members.filter((member) => member.id !== id); 
    saveMembers(updatedMembers); 
  }


  function saveMembers(members: TeamMember[]) {
    localStorage.setItem('teamMembers', JSON.stringify(members));
    
  }
