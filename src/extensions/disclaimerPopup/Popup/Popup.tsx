import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import { useBoolean } from '@uifabric/react-hooks';

const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};
const modalPropsStyles = { main: { maxWidth: 450 } };
const dialogContentProps = {
    type: DialogType.normal,
    title: 'Disclaimer!',
    subText: 'This site is currently configured as public, please do not store sensitive documents or information here.',
};

export default function DialogBlockingExample() {
    //const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [hideDialog, setDialogHidden] = React.useState(true);
    const [isDraggable] = useBoolean(false);
    const modalProps = React.useMemo(
        () => ({
            isBlocking: true,
            styles: modalPropsStyles,
            dragOptions: isDraggable ? dragOptions : undefined,
        }),
        [isDraggable],
    );

    function closing() {
        alert('You can\'t close this with escape!!!');
    }

    function btnClicked() {
        //alert('Button clicked!');
        localStorage.setItem("AckDateTimeStamp", new Date().toLocaleDateString());
        setDialogHidden(!hideDialog);
    }

    React.useEffect(() => {
        //alert('Something happened.');
        // Store
        if (localStorage.getItem("AckDateTimeStamp") !== "") {
            var ackDate = new Date(localStorage.getItem("AckDateTimeStamp"));
            const a = new Date("2021-04-28"),
                b = new Date();

            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(ackDate.getFullYear(), ackDate.getMonth(), ackDate.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            var diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            if (diff > 5) {
                setDialogHidden(false);
            }
        }
    }, []);

    return (
        <>
            <Dialog
                hidden={hideDialog}
                onDismiss={closing}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={btnClicked} text="Acknowledged" />
                </DialogFooter>
            </Dialog>
        </>
    );
}