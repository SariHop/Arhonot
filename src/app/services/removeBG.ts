export const removeBG = async (formData:FormData) => {
    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": `${process.env.API_KEY_removeBG}` },
            body: formData,
          });
          if (response.ok) {
            return await response.arrayBuffer();
          } else {
            throw new Error(`${response.status}: ${response.statusText}`);
          }
    } catch (error) {
        console.error("Error getting seasons:", error);
        throw error;
    }
};