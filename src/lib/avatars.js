export const ANIMAL_AVATARS = [
  { id: "fox", name: "Rubah", emoji: "🦊" },
  { id: "owl", name: "Burung Hantu", emoji: "🦉" },
  { id: "tiger", name: "Harimau", emoji: "🐯" },
  { id: "panda", name: "Panda", emoji: "🐼" },
  { id: "wolf", name: "Serigala", emoji: "🐺" },
  { id: "eagle", name: "Elang", emoji: "🦅" },
  { id: "octopus", name: "Gurita", emoji: "🐙" },
  { id: "bear", name: "Beruang", emoji: "🐻" },
  { id: "cat", name: "Kucing", emoji: "🐱" },
  { id: "frog", name: "Katak", emoji: "🐸" },
  { id: "lion", name: "Singa", emoji: "🦁" },
  { id: "dolphin", name: "Lumba-lumba", emoji: "🐬" },
];

export function getAvatarById(id) {
  return ANIMAL_AVATARS.find((a) => a.id === id) || ANIMAL_AVATARS[0];
}
