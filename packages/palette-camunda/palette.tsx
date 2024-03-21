import React, { useState } from "react";
import {
  Category,
  Component,
  Variant,
  Palette,
} from "@amplicode/ide-toolbox";
import {useTranslate, useNotify, Form, TextInput} from 'react-admin';
import {gql, useMutation, useQuery} from '@apollo/client';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";

export default () => (
  <Palette embeddable>
    <Category name="Camunda">
      <Component name="Start Process">
        <Variant name="Dialog" proto={StartProcessDialogProto} />
        <Variant
          name="start mutation"
          proto={StartProcessMutationProto}
        />
      </Component>
      <Component name="Task">
        <Variant name="get query" proto={CamundaTaskQueryProto} />
        <Variant name="list query" proto={CamundaTaskListQueryProto} />
        <Variant name="form query" proto={CamundaFormQueryProto} />
        <Variant name="variables query" proto={CamundaVariablesQueryProto} />
        <Variant
          name="complete mutation"
          proto={CompleteCamundaTaskMutationProto}
        />
      </Component>
      <Component name="Task Filter">
        <Variant name="get query" proto={CamundaTaskFilterQueryProto} />
        <Variant name="list query" proto={CamundaTaskFilterListQueryProto} />
      </Component>
    </Category>
  </Palette>
);


function StartProcessMutationProto() {
  const START_CAMUNDA_PROCESS = gql(`
    mutation StartCamundaProcess($bpmnProcessId: String!, $variables: String) {
      startCamundaProcess(bpmnProcessId: $bpmnProcessId, variables: $variables)
    }
  `);

  // TODO replace bpmnProcessId
  const bpmnProcessId: string = "";

  // TODO set variables in JSON format
  const variables: string = JSON.stringify({
    varName1: null,
    varName2: null
  });
  const [mutate, { data, loading, error }] = useMutation(START_CAMUNDA_PROCESS, {
    variables: {
      bpmnProcessId,
      variables,
    }
  });
}

function StartProcessDialogProto() {
  const START_CAMUNDA_PROCESS = gql(`
    mutation StartCamundaProcess($bpmnProcessId: String!, $variables: String) {
      startCamundaProcess(bpmnProcessId: $bpmnProcessId, variables: $variables)
    }
  `);

  interface StartProcessDialogProps {
    open: boolean;
    onClose: () => void;
  }

  const StartProcessDialog = ({ onClose, open }: StartProcessDialogProps) => {
    const [mutate] = useMutation(START_CAMUNDA_PROCESS);

    // TODO replace bpmnProcessId
    const bpmnProcessId: string = "";
    const translate = useTranslate();
    const notify = useNotify();

    const onStart = (data: Record<string, any>) => {
      mutate({
        variables: {
          variables: data.variables,
          bpmnProcessId,
        },
        onCompleted: () => {
          notify("camunda.startProcess.startProcessSuccessMessage", {
            type: "success",
          });
          onClose();
        },
        onError: () => {
          notify("camunda.startProcess.startProcessErrorMessage", {
            type: "error",
          });
        },
      });
    };

    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>
          {translate("camunda.startProcess.startProcessLabel")}
        </DialogTitle>
        <DialogContent>
          <Form onSubmit={onStart} id="start_process_form">
            <TextInput
              label="camunda.startProcess.startProcessVariableJson"
              source="variables"
              defaultValue=""
              helperText="camunda.startProcess.variablesJsonHelperText"
              multiline
              fullWidth
              minRows={4}
            />
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} startIcon={<CancelIcon />}>
            {translate("ra.action.close")}
          </Button>
          <Button
            form="start_process_form"
            type="submit"
            startIcon={<PlayArrowIcon />}
            variant="contained"
          >
            {translate("camunda.startProcess.startProcessButton")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const translate = useTranslate();

  const [openStartProcessDialog, setOpenStartProcessDialog] = useState(false);

  const handleOpenStartProcessDialog = () => {
    setOpenStartProcessDialog(true);
  };

  const handleCloseStartProcessDialog = () => {
    setOpenStartProcessDialog(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenStartProcessDialog}
        startIcon={<PlayArrowIcon />}
      >
        {translate("camunda.startProcess.startProcessButton")}
      </Button>
      <StartProcessDialog
        open={openStartProcessDialog}
        onClose={handleCloseStartProcessDialog}
      />
    </>
  );
}

function CamundaTaskListQueryProto() {
  const CAMUNDA_TASK_LIST = gql(`query CamundaTaskList_CamundaTaskList(
    $sort: [CamundaTaskOrderByInput],
    $page: OffsetPageInput,
    $filter: CamundaTaskListFilterInput,
  ) {
    camundaTaskList(
      page: $page,
      sort: $sort,
      filter: $filter
  ) {
    content {
        assignee
        creationDate
        dueDate
        followUpDate
        id
        name
        processName
        processInstanceKey
        taskState
    }
    totalElements
  }}`);

  const page = {
    number: 0,
    size: 10
  }
  const filter = {};
  const sort: any[] = [];
  const { loading, error, data } = useQuery(CAMUNDA_TASK_LIST, {
    variables: {
      sort,
      filter,
      page
    },
  });
}

function CamundaTaskQueryProto() {
  const CAMUNDA_TASK = gql(`query CamundaTask($id: String!) {
    camundaTask(id: $id) {
      id
      assignee
      creationDate
      dueDate
      followUpDate
      formKey
      name
      processDefinitionKey
      processInstanceKey
      processName
      taskState
    }
  }`);

  const id: string = "";
  const { loading, error, data } = useQuery(CAMUNDA_TASK, {
    variables: {
      id,
    },
  });
}

function CompleteCamundaTaskMutationProto() {
  const COMPLETE_CAMUNDA_TASK = gql(`
    mutation CompleteCamundaTask(
        $id: String!,
        $variables: String
    ) {
        completeCamundaTask(
            taskId: $id,
            variables: $variables)               
    }
  `);

  // TODO replace bpmnProcessId
  const id: string = "";

  // TODO set variables in JSON format
  const variables: string = JSON.stringify({
    varName1: null,
    varName2: null
  });
  const [mutate, { data, loading, error }] = useMutation(COMPLETE_CAMUNDA_TASK, {
    variables: {
      id,
      variables
    }
  });
}

function CamundaFormQueryProto() {
  const CAMUNDA_FORM = gql(`
    query CamundaForm(
      $processDefinitionId: String!,
      $formId: String!
    ) {
      camundaForm(
        formId: $formId,
        processDefinitionId: $processDefinitionId
    ) {
      id
      processDefinitionId
      schema
    }}
  `);

  const processDefinitionId: string = "";
  const formId: string = "";
  const { loading, error, data } = useQuery(CAMUNDA_FORM, {
    variables: {
      processDefinitionId,
      formId,
    },
  });
}

function CamundaVariablesQueryProto() {
  const CAMUNDA_VARIABLES = gql(`
    query CamundaVariables(
        $taskId: String!
    ) {
      camundaVariables(
        taskId: $taskId) 
    }
  `);

  const taskId: string = "";
  const { loading, error, data } = useQuery(CAMUNDA_VARIABLES, {
    variables: {
      taskId,
    },
  });
}

function CamundaTaskFilterListQueryProto() {
  const CAMUNDA_TASK_FILTER_LIST =
    gql(`query CamundaTaskFilterList($page: OffsetPageInput) {
      camundaTaskFilterList(page: $page) {
        content {
          id
          name
          isDefault
          conditions {
            id
            type
            values
            valueExpression
          }
        }
        totalElements
      }
    }`);

  const page = {
    number: 0,
    size: 10
  }
  const { loading, error, data } = useQuery(CAMUNDA_TASK_FILTER_LIST, {
    variables: {page},
  });
}

function CamundaTaskFilterQueryProto() {
  const CAMUNDA_TASK_FILTER = gql(`query CamundaTaskFilter($id: ID!) {
    camundaTaskFilter(id: $id) {
      id
      name
      isDefault
      conditions {
        id
        type
        values
        valueExpression
      }
    }
  }`);

  const id: string = "";
  const { loading, error, data } = useQuery(CAMUNDA_TASK_FILTER, {
    variables: {
      id,
    },
  });
}
