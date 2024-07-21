// File: composables/useColor.ts
export const useColor = () => {
  const color: Ref<string> = ref('pink');

  const changeColor = (newColor: string) => {
    color.value = newColor;
  };

  return {
    color,
    changeColor,
  };
};
