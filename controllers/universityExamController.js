const Slot = require('../models/Slot');

const getSubcode = async (req, res) => {
    const { sem, branch, slot } = req.body;
    if (!branch || !slot) return res.sendStatus(400).json({ 'message': 'provide branch and slot' });
    //enter branch and slot in capital letters
    try {
        const slots = await Slot.findOne({ sem: sem, branch: branch, slot: slot }, { subcode: 1, _id: 0 });
        //sending onl subcode array
        res.send(slots.subcode);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};




module.exports = { getSubcode };