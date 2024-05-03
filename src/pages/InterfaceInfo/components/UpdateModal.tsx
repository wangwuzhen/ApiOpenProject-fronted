import {
    ModalForm, ProColumns,
    ProFormDateTimePicker, ProFormInstance,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProTable,
    StepsForm,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React, {useEffect, useRef} from 'react';
import {values} from "lodash";
// import InterfaceInfo = API.InterfaceInfo;


//定义属性
export type Props = {
    values: API.InterfaceInfo;
    columns: ProColumns<API.InterfaceInfo>[];
    onCancel: () => void;
    onSubmit: (values:API.InterfaceInfo) => Promise<void>;
    visible: boolean;

};
//将属性传递进来
const UpdateModal: React.FC<Props> = (props) => {
    //将columns传递进来
    const { values,visible,columns,onCancel,onSubmit}=props;
    const  fromRef=useRef<ProFormInstance>();

    useEffect(()=>{
        if(fromRef){
            fromRef.current?.setFieldsValue(values);
        }
    },[values])
  return(
     <Modal visible={visible} onCancel={()=>onCancel?.()}>
       <ProTable type="form"
                 columns={columns}
                 formRef={fromRef}
                 onSubmit={async (value) => {
                 onSubmit?.(value)
       }} />
     </Modal>

  );
};
export default UpdateModal;
