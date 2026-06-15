import { describe, it, vi, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from '../index' 
import { MemoryRouter } from 'react-router-dom'

// Mock do useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

const mockedNavigate = vi.fn()

describe('ErrorPage', () => {
  it('deve renderizar o título e a mensagem de erro', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    )

    expect(screen.getByText('404 - Página Não Encontrada')).toBeInTheDocument()
    expect(screen.getByText(/Ops! A página que você tentou acessar não existe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar à página anterior/i })).toBeInTheDocument()
  })

  it('deve chamar navigate(-1) ao clicar no botão', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    )

    const button = screen.getByRole('button', { name: /voltar à página anterior/i })
    fireEvent.click(button)

    expect(mockedNavigate).toHaveBeenCalledWith(-1)
  })
})
