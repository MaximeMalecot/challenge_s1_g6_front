<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import ToggleBtn from "../../../components/common/ToggleBtn.vue";
import '@vueform/slider/themes/default.css'
import Slider from '@vueform/slider'

const props = defineProps({
    formData: Object
});

const enablePriceRange = ref(true);
const priceRange = ref([props.formData.price_range.minPrice, props.formData.price_range.maxPrice]);

const enableDuration = ref(true);
let duration = reactive({
    value: props.formData.duration.value,
    unit: props.formData.duration.unit
});
const UNITS = ["mois"];

watch(priceRange, (newVal) => {
    const [minPrice, maxPrice] = newVal;
    props.formData.price_range = { minPrice, maxPrice };
});

watch(enablePriceRange, (val) => {
    if (!val) {
        props.formData.price_range = { minPrice: 0, maxPrice: 100 };
    }
});

watch(duration, (newVal) => {
    const { value, unit } = newVal;
    if(value <=  0) return;
    props.formData.duration = { value, unit };
});

watch(enableDuration, (val, prev) => {
    if (!prev && val) {
        duration.value = 1;
        duration.unit = UNITS[0];
    }
});

onMounted(() => {
    if (props.formData.price_range.minPrice !== 0 && props.formData.price_range.maxPrice !== 0) {
        enablePriceRange.value = true;
    }

    if (props.formData.duration.value !== null && props.formData.duration.unit !== null) {
        enableDuration.value = true;
    }
});


</script>

<template>
    <div class="step_3">
        <div class="header">
            <h3>Détails</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit obcaecati accusamus vero fugiat, animi
                facere
                odio, sequi dignissimos earum, dicta incidunt nostrum deserunt atque mollitia! Quia neque consequuntur
                accusantium rem?</p>
        </div>
        <div class="content">
            <div class="selector">
                <div class="toggle">
                    <div class="checkbox">
                        <!-- <input disabled :checked="enablePriceRange" type="checkbox" /> -->
                        <p>Specifier une gamme de prix</p>
                    </div>
                    <p class="description">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam est mollitia
                        soluta, nostrum
                        quis
                        nulla animi facilis, rerum ex repellat eligendi maiores dolor sequi laborum, ullam aliquid
                        adipisci eum. Illo!</p>
                </div>
                <div class="sub_content" v-show="enablePriceRange">
                    <Slider :min="1" :max="1000" v-model="priceRange" />
                </div>
            </div>
            <div class="selector">
                <div class="toggle">
                    <div class="checkbox">
                        <!-- <input :checked="enableDuration" type="checkbox" /> -->
                        <p>Specifier une durée pour la mission</p>
                    </div>
                    <p class="description">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam est mollitia
                        soluta, nostrum
                        quis
                        nulla animi facilis, rerum ex repellat eligendi maiores dolor sequi laborum, ullam aliquid
                        adipisci eum. Illo!</p>
                </div>
                <div class="sub_content" v-show="enableDuration">
                    <input type="number" v-model="duration.value" min="1" />
                    <select v-model="duration.unit" :selected="UNITS[0]">
                        <option v-for="unit in UNITS" :value="unit">{{ unit }}</option>
                    </select>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.step_3 {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    gap: 10px;

    .header {
        h3 {
            margin: 0;
            padding: 0;
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .selector {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border);

            .toggle {
                width: 100%;
                display: flex;
                flex-direction: column;

                .checkbox {
                    width: 100%;
                    display: flex;
                    cursor: pointer;

                    p {
                        margin: 0;
                        padding: 0;
                    }
                }

            }

            .description {
                font-size: 14px;
            }

            .sub_content {
                padding: 20px 0;
            }
        }
    }
}
</style>