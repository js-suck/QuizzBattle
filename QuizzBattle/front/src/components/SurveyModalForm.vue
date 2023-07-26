<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            width="1024"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    color="primary"
                    v-bind="props"
                >
                    Open Dialog
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">New Category</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                    label="Name"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                    label="Description"
                                    persistent-hint
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <section id="addSectionQuestion">
                            <span class="text-h6">Question 1</span>
                            <v-row>
                                <v-col cols="12"
                                       sm="12"
                                       md="12">
                                    <v-text-field
                                            label=""
                                            type="text"
                                            required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <span class="text-h6">Good answer</span>
                            <v-row>
                                <v-col cols="12"
                                       sm="12"
                                       md="12"
                                >
                                    <v-text-field
                                            label=""
                                            type="text"
                                            required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <span class="text-h6">Bad answers</span>
                            <v-row>
                                <v-col
                                        cols="12"
                                        sm="4"
                                        md="4"
                                >
                                    <v-text-field
                                            label=""
                                            required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                        cols="12"
                                        sm="4"
                                        md="4"
                                >
                                    <v-text-field
                                            label=""
                                            required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                        cols="12"
                                        sm="4"
                                        md="4"
                                >
                                    <v-text-field
                                            label=""
                                            required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </section>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="addSectionQuestion"
                    >
                        Add Question
                    </v-btn>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
export default {
    data: () => ({
        dialog: false,
    }),
    function goToPage(pageNumber) {
        currentPage.value = pageNumber;
    }
}
const
</script>