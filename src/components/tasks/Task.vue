<script setup>
const props = defineProps(['task'])
</script>

<template>
    <div class="task">
        <h3 class="m-1">{{props.task.title}}</h3>
        <Divider class="my-0"/>
        <div class="p-1">
            <Textarea v-model="props.task.description" placeholder="description" class="w-full" auto-resize :rows="10" />
        </div>
        <div>
            <Checkbox id="taskDoneSwitch" v-model="props.task.done" class="m-1"/>
            <label for="taskDoneSwitch">Done</label>
        </div>
    </div>
<!--<pre>{{props.task}}</pre>-->
</template>

<style scoped>
.task {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0.2rem;
}

</style>