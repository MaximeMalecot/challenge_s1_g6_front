import { ref, watch, computed, reactive } from 'vue';
import ProjectService from '@/services/project.service';
import { useAuthStore } from '@/stores/auth';
import { PROPOSITION_STATUS } from '@/constants/status';
import propositionService from '@/services/proposition.service';

const useClientProjects = () => {
    const authStore = useAuthStore();
    const projects = ref([]);
    const project = ref({});
    const propositions = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const count = computed(() => propositions.value.length);

    const fetchAllProjects = async () => {
        loading.value = true;
        error.value = null;
        try {
            const userId = authStore.userData.userId;
            const res = await ProjectService.getUserProjects(userId);
            if(!res) throw new Error('An error occured');
            if(!res?.createdProjects || res.createdProjects.length == 0) throw new Error('No propositions found');
            projects.value = res.createdProjects
        } catch (e) {
            console.error(e.message);
            error.value = e.message;
            return false;
        }
        loading.value = false;
    };

    const fetchProject = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await ProjectService.getProject(id);
            if(!res) throw new Error('An error occured');
            if(!res?.id) throw new Error('No propositions found');
            project.value = res;
        } catch (e) {
            console.error(e.message);
            error.value = e.message;
            return false;
        }
        loading.value = false;
        return true;
    };

    const fetchProjectWithPropositions = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await propositionService.getProjectPropositions(id);
            if(!res || !res.id) throw new Error('An error occured');
            //if(!res?.propositions) throw new Error('No propositions found');
            const { propositions:tmpProps, ...rest } = res;
            propositions.value = tmpProps;
            project.value = rest;
        } catch (e) {
            console.error(e.message);
            error.value = e.message;
            return false;
        }
        loading.value = false;
        return true;
    }

    const repondToProposition = async (propositionId, status) => {
        const validStatus = [PROPOSITION_STATUS.ACCEPTED, PROPOSITION_STATUS.REFUSED];
        if(!validStatus.includes(status)) return;
        loading.value = true;
        error.value = null;
        try {
            const res = await propositionService.respondToProposition(propositionId, status);
            if(!res) throw new Error('An error occured');
            if(!res?.propositions) throw new Error('No propositions found');
            propositions.value = res.propositions;
        } catch (e) {
            console.error(e.message);
            error.value = e.message;
            return false;
        }
        loading.value = false;
        return true;
    }

    const updateProject = async (id, data) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await ProjectService.updateProject(id, data);
            if(!res) throw new Error('An error occured');
        } catch (e) {
            console.error(e.message);
            error.value = e.message;
            return false;
        }
        loading.value = false;
        return true;
    }

    return {
        projects,
        project,
        loading,
        error,
        count,
        fetchAllProjects,
        fetchProject,
        fetchProjectWithPropositions,
        propositions,
        repondToProposition,
        updateProject
    }
};

export default useClientProjects;