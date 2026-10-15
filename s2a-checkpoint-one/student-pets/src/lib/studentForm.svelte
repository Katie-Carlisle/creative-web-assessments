
<script>
  import { petRoster } from './petRoster.svelte'

  let studentName = $state('');
  let petName = $state('');
  let petType = $state('');

  /** @param {SubmitEvent} event */ //needed.
  function addStudent(event) {
    event.preventDefault();

    if (!studentName.trim()) return;

    petRoster.students.push({
      id: Date.now(),
      name: studentName.trim(),
      petName: petName.trim(),
      petType: petName.trim() ? petType : ''
    });

    studentName = '';
    petName = '';
    petType = '';
  }
</script>

<section>
  <h2>Add a student</h2>

  <form onsubmit={addStudent}>
    <label for="studentName">Student name</label>
    <input
      id="studentName"
      bind:value={studentName}
      placeholder="Enter student name"
      required
    />

    <label for="petName">Pet name (optional)</label>
    <input
      id="petName"
      bind:value={petName}
      placeholder="Enter pet name"
    />

    <label for="petType">Pet type</label>
    <select id="petType" bind:value={petType}>
      <option value="">Select a pet type</option>
      <option value="Dog">Dog</option>
      <option value="Cat">Cat</option>
      <option value="Rabbit">Tortoise</option>
      <option value="Bird">Bird</option>
      <option value="Fish">Fish</option>
      <option value="Other">Other</option>
    </select>

    <button type="submit">Add student</button>
  </form>
</section>
