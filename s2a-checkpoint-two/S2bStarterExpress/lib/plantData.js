
import Plant from '../models/Plant.js';

// READ — retrieve plants
export async function getAll(lightNeeds) {
    const filter = lightNeeds ? { lightNeeds } : {};

    return Plant.find(filter);
}

// READ — retrieve one plant
export async function getById(id) {
    return Plant.findById(id);
}

// CREATE — save new plant
export async function create(data) {
    return Plant.create(data);
}

// UPDATE — modify plant
export async function update(id, changes) {
    return Plant.findByIdAndUpdate(
        id,
        changes,
        { new: true, runValidators: true }
    );
}

// DELETE — remove plant
export async function remove(id) {
    return Plant.findByIdAndDelete(id);
}
