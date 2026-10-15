
<script>
  import './classless.css';
  import StudentForm from './lib/studentForm.svelte';
  import StudentList from './lib/studentList.svelte';
</script>


<title>Student Pet List</title>
<meta
  name="description"
  content="A roster connecting students with their pets."
/>


<h1>Student Pets</h1>

<main>
  <StudentForm />
  <StudentList />
</main>
