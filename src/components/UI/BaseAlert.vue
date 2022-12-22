<template>
    <div v-if="!serverResponse" class="alert alert-danger" role="alert">
        <slot name="title"></slot>
    </div>
</template>

<script>

export default {
    props: ['serverResponse']
}

</script>