import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { OpenDocumentButton } from '_/components/generic/buttons/OpenDocumentButton/OpenDocumentButton';
import useResident from '_/hooks/useResident/useResident';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

/**
 * Table that displays all documents
 */
function DocumentTable(): JSX.Element {
  const residentId = useRecoilValue(residentViewState)
    .selectedResident as string;
  const { resident } = useResident(residentId);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Erstellungsdatum</TableCell>
            <TableCell>Betreffdatum</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Typ</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resident?.documents.map((document) => (
            <TableRow
              key={document.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{document.creationDate.toPreferredString()}</TableCell>
              <TableCell>{document.subjectDate.toPreferredString()}</TableCell>
              <TableCell>{document.name}</TableCell>
              <TableCell>{document.type}</TableCell>
              <TableCell>
                <OpenDocumentButton
                  documentId={document.id}
                  documentTarget={{ type: 'resident', residentId }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DocumentTable;
