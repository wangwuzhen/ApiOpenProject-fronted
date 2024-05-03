import {
  ModalForm, ProColumns,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea, ProTable,
  StepsForm,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React from 'react';
// import InterfaceInfo = API.InterfaceInfo;


//定义属性
export type Props = {
    columns: ProColumns<API.InterfaceInfo>[];
    onCancel: () => void;
    onSubmit: (values:API.InterfaceInfo) => Promise<void>;
    visible: boolean;

};
//将属性传递进来
const CreateModal: React.FC<Props> = (props) => {
    //将columns传递进来
    const {visible,columns,onCancel,onSubmit}=props;
  return(
     <Modal visible={visible} onCancel={()=>onCancel?.()}>\
       <ProTable type="form" columns={columns}
                 onSubmit={async (value) => {
                 onSubmit?.(value)
       }} />
     </Modal>

  );
};
export default CreateModal;
