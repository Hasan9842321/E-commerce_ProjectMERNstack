const fs = require('fs').promises;

const deleteImage = async(userImagePath) => {

    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log("user image was deleated");
    } catch (error) {
        console.log("user image doesnot exist")

    }

}

module.exports = deleteImage;